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
import org.springframework.samples.petclinic.genai.dto.*;
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

    public List<TreatmentDetails> getAllTreatments() {
        try {
            LOG.info("Fetching all treatments");
            return restClient.get()
                .uri(getTreatmentServiceUri() + "/treatments")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
        } catch (Exception e) {
            LOG.error("Error fetching treatments", e);
            throw e;
        }
    }

    public List<MedicineDetails> getAllMedicines() {
        try {
            LOG.info("Fetching all medicines");
            return restClient.get()
                .uri(getTreatmentServiceUri() + "/medicines")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
        } catch (Exception e) {
            LOG.error("Error fetching medicines", e);
            throw e;
        }
    }

    public List<InvoiceDetails> getInvoicesByOwner(int ownerId) {
        try {
            LOG.info("Fetching invoices for owner {}", ownerId);
            return restClient.get()
                .uri(getInvoiceServiceUri() + "/invoices/owner/" + ownerId)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
        } catch (Exception e) {
            LOG.error("Error fetching invoices for owner {}", ownerId, e);
            throw e;
        }
    }

    public List<InvoiceDetails> getInvoicesByPet(int petId) {
        try {
            LOG.info("Fetching invoices for pet {}", petId);
            return restClient.get()
                .uri(getInvoiceServiceUri() + "/invoices/pet/" + petId)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
        } catch (Exception e) {
            LOG.error("Error fetching invoices for pet {}", petId, e);
            throw e;
        }
    }

    public void markInvoiceAsPaid(int invoiceId) {
        try {
            LOG.info("Marking invoice {} as PAID", invoiceId);
            restClient.put()
                .uri(getInvoiceServiceUri() + "/invoices/" + invoiceId + "/status?status=PAID")
                .retrieve()
                .toBodilessEntity();
            LOG.info("Invoice {} marked as PAID", invoiceId);
        } catch (Exception e) {
            LOG.error("Error updating invoice {} status", invoiceId, e);
            throw e;
        }
    }

    public DailyReportDetails getDailyReport(String date) {
        String uri = getReportServiceUri() + "/reports/daily" + (date != null ? "?date=" + date : "");
        return restClient.get().uri(uri).retrieve().body(DailyReportDetails.class);
    }

    public MonthlyReportDetails getMonthlyReport(Integer month, Integer year) {
        String uri = getReportServiceUri() + "/reports/monthly?month=" + month + "&year=" + year;
        return restClient.get().uri(uri).retrieve().body(MonthlyReportDetails.class);
    }

    public AnnualReportDetails getAnnualReport(Integer year) {
        String uri = getReportServiceUri() + "/reports/annual?year=" + year;
        return restClient.get().uri(uri).retrieve().body(AnnualReportDetails.class);
    }

    public SummaryReportDetails getSummaryReport() {
        return restClient.get().uri(getReportServiceUri() + "/reports/summary")
            .retrieve().body(SummaryReportDetails.class);
    }

    @NotNull
    private URI getTreatmentServiceUri() {
        return discoveryClient.getInstances("treatment-service").get(0).getUri();
    }

    @NotNull
    private URI getInvoiceServiceUri() {
        return discoveryClient.getInstances("invoice-service").get(0).getUri();
    }

    @NotNull
    private URI getReportServiceUri() {
        return discoveryClient.getInstances("report-service").get(0).getUri();
    }
}
