package org.springframework.samples.petclinic.vets.exception;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException (String message){
        super (message);
    }
}
