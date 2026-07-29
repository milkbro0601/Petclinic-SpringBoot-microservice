package org.springframework.samples.petclinic.genai.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public record PetRequest(int id,
                  @JsonFormat(pattern = "yyyy-MM-dd")
                  Date birthDate,
                  String name,
                  int typeId
) {

}
