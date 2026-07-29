package org.springframework.samples.petclinic.genai.dto;

import java.util.List;

public record OwnerDetails(
    int id,
    String firstName,
    String lastName,
    String address,
    String city,
    String telephone,
    List<PetDetails> pets
) {
}
