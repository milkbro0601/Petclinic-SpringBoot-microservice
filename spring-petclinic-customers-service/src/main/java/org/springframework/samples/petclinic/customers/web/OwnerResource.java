/*
 * Copyright 2002-2021 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.springframework.samples.petclinic.customers.web;

import io.micrometer.core.annotation.Timed;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.samples.petclinic.customers.web.mapper.OwnerEntityMapper;
import org.springframework.samples.petclinic.customers.model.Owner;
import org.springframework.samples.petclinic.customers.model.OwnerRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.samples.petclinic.customers.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;

/**
 * @author Juergen Hoeller
 * @author Ken Krebs
 * @author Arjen Poutsma
 * @author Michael Isvy
 * @author Maciej Szarlinski
 */
@RequestMapping("/owners")
@RestController
@Timed("petclinic.owner")
class OwnerResource {

    private static final Logger log = LoggerFactory.getLogger(OwnerResource.class);

    private final OwnerRepository ownerRepository;
    private final OwnerEntityMapper ownerEntityMapper;

    OwnerResource(OwnerRepository ownerRepository, OwnerEntityMapper ownerEntityMapper) {
        this.ownerRepository = ownerRepository;
        this.ownerEntityMapper = ownerEntityMapper;
    }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Owner createOwner(@Valid @RequestBody OwnerRequest ownerRequest) {
        log.info("Request to create owner: {}", ownerRequest);
        Owner owner = ownerEntityMapper.map(new Owner(), ownerRequest);
        Owner saved = ownerRepository.save(owner);
        log.info("Owner saved successfully with id: {}", saved.getId());
        return saved;
    }

    @GetMapping(value = "/{ownerId}")
    public Owner findOwner(@PathVariable("ownerId") @Min(1) int ownerId) {
        log.info("Request to find owner with id: {}", ownerId);
        return ownerRepository.findById(ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("Owner " + ownerId + " not found"));
    }

    @GetMapping
    public List<Owner> findAll() {
        log.info("Request to get all owners");
        return ownerRepository.findAll();
    }

    @PutMapping(value = "/{ownerId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateOwner(@PathVariable("ownerId") @Min(1) int ownerId, @Valid @RequestBody OwnerRequest ownerRequest) {
        final Owner ownerModel = ownerRepository.findById(ownerId).orElseThrow(() -> new ResourceNotFoundException("Owner " + ownerId + " not found"));

        ownerEntityMapper.map(ownerModel, ownerRequest);
        log.info("Saving owner {}", ownerModel);
        ownerRepository.save(ownerModel);
    }
}
