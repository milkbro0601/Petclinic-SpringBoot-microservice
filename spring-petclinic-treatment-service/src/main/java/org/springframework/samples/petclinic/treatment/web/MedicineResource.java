package org.springframework.samples.petclinic.treatment.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.samples.petclinic.treatment.exception.ResourceNotFoundException;
import org.springframework.samples.petclinic.treatment.model.Medicine;
import org.springframework.samples.petclinic.treatment.model.MedicineRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicines")
@RequiredArgsConstructor
public class MedicineResource {

    private static final Logger log = LoggerFactory.getLogger(MedicineResource.class);
    private final MedicineRepository medicineRepository;

    @GetMapping
    public List<Medicine> getAllMedicines() {
        log.info("Request to get all medicines");
        return medicineRepository.findAll();
    }

    @GetMapping("/{id}")
    public Medicine getMedicineById(@PathVariable int id) {
        log.info("Request to get medicine with id: {}", id);
        return medicineRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("Medicine with id {} not found", id);
                return new ResourceNotFoundException("Medicine " + id + " not found");
            });
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Medicine createMedicine(@Valid @RequestBody Medicine medicine) {
        log.info("Request to create medicine: {}", medicine);
        Medicine saved = medicineRepository.save(medicine);
        log.info("Medicine saved successfully with id: {}", saved.getId());
        return saved;
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateMedicine(
        @PathVariable int id,
        @Valid @RequestBody Medicine medicine) {

        log.info("Request to update medicine with id: {}", id);
        Medicine existing = medicineRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("Medicine with id {} not found for update", id);
                return new ResourceNotFoundException("Medicine " + id + " not found");
            });
        existing.setName(medicine.getName());
        existing.setDescription(medicine.getDescription());
        existing.setUnit(medicine.getUnit());
        existing.setPrice(medicine.getPrice());
        medicineRepository.save(existing);
        log.info("Medicine updated successfully with id: {}", id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMedicine(@PathVariable int id) {
        log.info("Request to delete medicine with id: {}", id);
        medicineRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("Medicine with id {} not found for delete", id);
                return new ResourceNotFoundException("Medicine " + id + " not found");
            });
        medicineRepository.deleteById(id);
        log.info("Medicine deleted successfully with id: {}", id);
    }
}
