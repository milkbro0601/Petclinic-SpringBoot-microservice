package org.springframework.samples.petclinic.genai;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.samples.petclinic.genai.dto.*;
import org.springframework.stereotype.Component;
import tools.jackson.core.JacksonException;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;

/**
 * This class defines the @Bean functions that the LLM provider will invoke when it
 * requires more Information on a given topic. The currently available functions enable
 * the LLM to get the list of owners and their pets, get information about the
 * veterinarians, and add a pet to an owner.
 *
 * @author Oded Shopen
 * @author Antoine Rey
 */
@Component
class PetclinicTools {

    private static final Logger LOG = LoggerFactory.getLogger(PetclinicTools.class);

    private final AIDataProvider petclinicAiProvider;

    PetclinicTools(AIDataProvider petclinicAiProvider) {
        this.petclinicAiProvider = petclinicAiProvider;
    }

    @Tool(description = "List the owners that the pet clinic has")
	public List<OwnerDetails> listOwners() {
        LOG.info("listOwners()");
		return petclinicAiProvider.getAllOwners();
	}

    @Tool(description = """
			Add a new pet owner to the pet clinic. The Owner must include a first name and a last name
			as two separate words,plus an address and a 10-digit phone number
			""")
	public OwnerDetails addOwnerToPetclinic(OwnerRequest ownerRequest) {
        LOG.info("addOwnerToPetclinic() ownerRequest={}", ownerRequest);
		return petclinicAiProvider.addOwnerToPetclinic(ownerRequest);
	}

    @Tool(description = "List the veterinarians that the pet clinic has")
	public List<String> listVets(@ToolParam(required = false) Vet vetRequest) {
        LOG.info("listVets() vetRequest={}", vetRequest);
        try {
            return petclinicAiProvider.getVets(vetRequest);
        } catch (JacksonException e) {
            LOG.error("Error processing JSON in the listVets function", e);
            return List.of();
        }
	}

    @Tool(description = """
			Add a pet with the specified petTypeId, to an owner identified by the ownerId.
			The allowed Pet types IDs are only: 1 = cat, 2 = dog, 3 = lizard, 4 = snake, 5 = bird,
			6 - hamster
			""")
	public PetDetails addPetToOwner(@ToolParam(description = "Pet's owner identifier") int ownerId, PetRequest petRequest) {
        LOG.info("addPetToOwner() ownerId={} petRequest={}", ownerId, petRequest);
		return petclinicAiProvider.addPetToOwner(ownerId, petRequest);
	}

    @Tool(description = """
    Update an existing owner's details, identified by ownerId. This replaces the full record,
    so first name, last name, address, city, and a 10-digit phone number must all be provided
    even if only one field is changing — fetch the owner's current details first if unsure.
    """)
    public String updateOwner(@ToolParam(description = "Owner's identifier") int ownerId, OwnerRequest ownerRequest) {
        LOG.info("updateOwner() ownerId={} ownerRequest={}", ownerId, ownerRequest);
        petclinicAiProvider.updateOwner(ownerId, ownerRequest);
        return "Owner " + ownerId + " has been updated.";
    }

    @Tool(description = """
        Update an existing pet's details, identified by ownerId and petId. This replaces the full
        record, so name, birth date, and pet type ID must all be provided even if only one field
        is changing — fetch the pet's current details first if unsure.
        The allowed Pet types IDs are only: 1 = cat, 2 = dog, 3 = lizard, 4 = snake, 5 = bird, 6 = hamster
        """)
    public String updatePet(@ToolParam(description = "Pet's owner identifier") int ownerId,
                            @ToolParam(description = "Pet's identifier") int petId,
                            PetRequest petRequest) {
        LOG.info("updatePet() ownerId={} petId={} petRequest={}", ownerId, petId, petRequest);
        petclinicAiProvider.updatePet(ownerId, petId, petRequest);
        return "Pet " + petId + " has been updated.";
    }

    @Tool(description = "List all treatments the clinic offers with prices")
    public List<TreatmentDetails> listTreatments() {
        return petclinicAiProvider.getAllTreatments();
    }

    @Tool(description = "List all medicines the clinic stocks with prices")
    public List<MedicineDetails> listMedicines() {
        return petclinicAiProvider.getAllMedicines();
    }

    @Tool(description = "Get all invoices for a specific owner, identified by ownerId")
    public List<InvoiceDetails> getInvoicesForOwner(@ToolParam(description = "Owner's identifier") int ownerId) {
        return petclinicAiProvider.getInvoicesByOwner(ownerId);
    }

    @Tool(description = "Get all invoices for a specific pet, identified by petId")
    public List<InvoiceDetails> getInvoicesForPet(@ToolParam(description = "Pet's identifier") int petId) {
        return petclinicAiProvider.getInvoicesByPet(petId);
    }

    @Tool(description = "Get the clinic's visit report for a specific day. Date format yyyy-MM-dd, defaults to today if omitted.")
    public DailyReportDetails getDailyReport(@ToolParam(required = false) String date) {
        return petclinicAiProvider.getDailyReport(date);
    }

    @Tool(description = "Get the clinic's visit report for a specific month and year")
    public MonthlyReportDetails getMonthlyReport(@ToolParam(required = false) Integer month,
                                                 @ToolParam(required = false) Integer year) {
        return petclinicAiProvider.getMonthlyReport(month, year);
    }

    @Tool(description = "Get the clinic's visit report for a specific year")
    public AnnualReportDetails getAnnualReport(@ToolParam(required = false) Integer year) {
        return petclinicAiProvider.getAnnualReport(year);
    }

    @Tool(description = "Get an overall summary of clinic visits: totals for today, this month, this year, and busiest day/month")
    public SummaryReportDetails getClinicSummary() {
        return petclinicAiProvider.getSummaryReport();
    }

    @Tool(description = """
    Mark an invoice as PAID. IMPORTANT: only call this with confirmed=true after the user
    has explicitly said yes to a confirmation you asked them. On the first call, if you
    are not certain the user confirmed, call with confirmed=false to get a preview instead.
    """)
    public String markInvoiceAsPaid(@ToolParam(description = "Invoice identifier") int invoiceId,
                                    @ToolParam(description = "Set true only after explicit user confirmation") boolean confirmed) {
        if (!confirmed) {
            return "This will mark invoice " + invoiceId + " as PAID. Please confirm with the user before proceeding, then call again with confirmed=true.";
        }
        petclinicAiProvider.markInvoiceAsPaid(invoiceId);
        return "Invoice " + invoiceId + " has been marked as paid.";
    }
}

record OwnerRequest(@NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank String address,
        @NotBlank String city,
        @NotBlank @Digits(fraction = 0, integer = 12) String telephone) {
}
