package com.campusflow.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record StudentRequest(
        @NotBlank @Size(max = 20) String studentCode,
        @NotBlank @Size(max = 50) String firstName,
        @NotBlank @Size(max = 50) String lastName,
        @NotBlank @Size(max = 80) String major,
        @Size(max = 15) String phone,
        @NotNull @DecimalMin("0.0") @DecimalMax("10.0") @Digits(integer = 2, fraction = 2) BigDecimal gpa,
        @Past LocalDate dateOfBirth
) {
}
