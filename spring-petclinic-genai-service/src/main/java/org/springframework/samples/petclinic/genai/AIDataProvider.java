package org.springframework.samples.petclinic.genai;

import java.net.URI;
import java.util.List;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.samples.petclinic.genai.dto.OwnerDetails;
import org.springframework.samples.petclinic.genai.dto.PetDetails;
import org.springframework.samples.petclinic.genai.dto.PetRequest;
import org.springframework.samples.petclinic.genai.dto.Vet;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

/**
 * Functions that are invoked by the LLM will use this bean to query the system of record
 * for information such as listing owners and vets, or adding pets to an owner.
 *
 * @author Oded Shopen
 */
@Service
public class AIDataProvider {

	private static final Logger LOG = LoggerFactory.getLogger(AIDataProvider.class);

	private final VectorStore vectorStore;

    private final RestClient restClient;

    private final DiscoveryClient discoveryClient;

	public AIDataProvider(VectorStore vectorStore, DiscoveryClient discoveryClient) {
        this.restClient = RestClient.builder().build();
        this.vectorStore = vectorStore;
        this.discoveryClient = discoveryClient;
    }

	public List<OwnerDetails> getAllOwners() {
        try {
            LOG.info("Fetching all owners from customer service");
            List<OwnerDetails> owners = restClient
                .get()
                .uri(getCustomerServiceUri() + "/owners")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });
            LOG.info("Successfully fetched {} owners", owners != null ? owners.size() : 0);
            return owners;
        } catch (Exception e) {
            LOG.error("Error fetching owners from customer service", e);
            throw e;
        }
	}

    public List<String> getVets(Vet vetRequest) throws JacksonException {
		ObjectMapper objectMapper = new ObjectMapper();
        
        int topK = 20;
        String query = "veterinarian";
        
        if (vetRequest != null) {
            // If specific criteria provided, use them for similarity search
            query = objectMapper.writeValueAsString(vetRequest);
            topK = 20;
        } else {
            // Provide a limit of 50 results when zero parameters are sent
            topK = 50;
        }
        
        LOG.info("Searching vector store with query: {} (topK: {})", query, topK);
        SearchRequest sr = SearchRequest.builder()
            .query(query)
            .topK(topK)
            .build();

		List<Document> topMatches = this.vectorStore.similaritySearch(sr);
        LOG.info("Found {} vet documents", topMatches.size());
		return topMatches.stream().map(Document::getFormattedContent).toList();
	}

	public PetDetails addPetToOwner(int ownerId, PetRequest petRequest) {
        try {
            LOG.info("Adding pet to owner {} with request: {}", ownerId, petRequest);
            PetDetails pet = restClient
                .post()
                .uri(getCustomerServiceUri()  + "/owners/" + ownerId + "/pets")
                .body(petRequest)
                .retrieve()
                .body(PetDetails.class);
            LOG.info("Successfully added pet: {}", pet);
            return pet;
        } catch (Exception e) {
            LOG.error("Error adding pet to owner {}", ownerId, e);
            throw e;
        }
	}

	public OwnerDetails addOwnerToPetclinic(OwnerRequest ownerRequest) {
       try {
           LOG.info("Adding new owner: {}", ownerRequest);
           OwnerDetails owner = restClient
                .post()
                .uri(getCustomerServiceUri() + "/owners")
                .body(ownerRequest)
                .retrieve()
                .body(OwnerDetails.class);
           LOG.info("Successfully added owner: {}", owner);
           return owner;
       } catch (Exception e) {
           LOG.error("Error adding owner", e);
           throw e;
       }
	}

    @NotNull
    private URI getCustomerServiceUri() {
        return discoveryClient.getInstances("customers-service").get(0).getUri();
    }

}
