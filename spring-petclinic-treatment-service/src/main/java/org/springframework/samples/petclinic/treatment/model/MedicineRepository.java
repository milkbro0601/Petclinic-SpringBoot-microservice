package org.springframework.samples.petclinic.treatment.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Integer> {
    List<Medicine> findByNameContainingIgnoreCase(String name);
}
