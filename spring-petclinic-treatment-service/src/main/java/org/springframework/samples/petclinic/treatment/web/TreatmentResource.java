package org.springframework.samples.petclinic.treatment.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.samples.petclinic.treatment.exception.ResourceNotFoundException;
import org.springframework.samples.petclinic.treatment.model.Treatment;
import org.springframework.samples.petclinic.treatment.model.TreatmentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/treatments")
@RequiredArgsConstructor
public class TreatmentResource {

    private static final Logger log = LoggerFactory.getLogger(TreatmentResource.class);
    private final TreatmentRepository treatmentRepository;

    @GetMapping
    public List<Treatment> getAllTreatments() {
        log.info("Request to get all treatments");
        return treatmentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Treatment getTreatmentById(@PathVariable int id) {
        log.info("Request to get treatment with id: {}", id);
        return treatmentRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("Treatment with id {} not found", id);
                return new ResourceNotFoundException("Treatment " + id + " not found");
            });
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Treatment createTreatment(@Valid @RequestBody Treatment treatment) {
        log.info("Request to create treatment: {}", treatment);
        Treatment saved = treatmentRepository.save(treatment);
        log.info("Treatment saved successfully with id: {}", saved.getId());
        return saved;
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateTreatment(
        @PathVariable int id,
        @Valid @RequestBody Treatment treatment) {

        log.info("Request to update treatment with id: {}", id);
        Treatment existing = treatmentRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("Treatment with id {} not found for update", id);
                return new ResourceNotFoundException("Treatment " + id + " not found");
            });
        existing.setName(treatment.getName());
        existing.setDescription(treatment.getDescription());
        existing.setPrice(treatment.getPrice());
        treatmentRepository.save(existing);
        log.info("Treatment updated successfully with id: {}", id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTreatment(@PathVariable int id) {
        log.info("Request to delete treatment with id: {}", id);
        treatmentRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("Treatment with id {} not found for delete", id);
                return new ResourceNotFoundException("Treatment " + id + " not found");
            });
        treatmentRepository.deleteById(id);
        log.info("Treatment deleted successfully with id: {}", id);
    }
}
