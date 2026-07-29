package org.springframework.samples.petclinic.genai.dto;

import java.util.List;

public record PetDetails(
    int id,
    String name,
    String birthDate,
    PetType type,
    List<VisitDetails> visits
){
}
