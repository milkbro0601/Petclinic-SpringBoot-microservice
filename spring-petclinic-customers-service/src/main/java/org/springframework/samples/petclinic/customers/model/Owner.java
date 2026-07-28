package org.springframework.samples.petclinic.customers.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import org.springframework.beans.support.MutableSortDefinition;
import org.springframework.beans.support.PropertyComparator;
import org.springframework.core.style.ToStringCreator;

import java.util.*;

@Entity
@Table(name = "owners")
@Data
@NoArgsConstructor
public class Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "First name cannot be empty")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    @NotBlank(message = "Last name cannot be empty")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @Column(name = "address")
    @NotBlank(message = "Address cannot be empty")
    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    @Column(name = "city")
    @NotBlank(message = "City cannot be empty")
    @Size(max = 100, message = "City cannot exceed 100 characters")
    private String city;

    @Column(name = "telephone")
    @NotBlank(message = "Telephone cannot be empty")
    @Digits(fraction = 0, integer = 12, message = "Telephone must be numbers only")
    @Size(min = 8, max = 12, message = "Telephone must be between 8 and 12 digits")
    private String telephone;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "owner")
    @ToString.Exclude      // ← ADD THIS
    @EqualsAndHashCode.Exclude  // ← ADD THIS
    private Set<Pet> pets;

    protected Set<Pet> getPetsInternal() {
        if (this.pets == null) {
            this.pets = new HashSet<>();
        }
        return this.pets;
    }

    public List<Pet> getPets() {
        final List<Pet> sortedPets = new ArrayList<>(getPetsInternal());
        PropertyComparator.sort(sortedPets,
            new MutableSortDefinition("name", true, true));
        return Collections.unmodifiableList(sortedPets);
    }

    public void addPet(Pet pet) {
        getPetsInternal().add(pet);
        pet.setOwner(this);
    }

    @Override
    public String toString() {
        return new ToStringCreator(this)
            .append("id", this.getId())
            .append("lastName", this.getLastName())
            .append("firstName", this.getFirstName())
            .append("address", this.address)
            .append("city", this.city)
            .append("telephone", this.telephone)
            .toString();
    }
}