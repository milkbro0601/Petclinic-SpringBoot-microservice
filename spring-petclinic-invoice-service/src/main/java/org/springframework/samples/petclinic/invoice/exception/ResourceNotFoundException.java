package org.springframework.samples.petclinic.invoice.exception;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String message){
        super(message);
    }
}
