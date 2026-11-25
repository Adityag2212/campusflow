package com.campusflow.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "students", uniqueConstraints = {
        @UniqueConstraint(name = "uk_student_code", columnNames = "student_code")
})
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_code", nullable = false, length = 20)
    private String studentCode;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, length = 80)
    private String major;

    @Column(length = 15)
    private String phone;

    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal gpa;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    protected Student() {
    }

    public Student(String studentCode, String firstName, String lastName,
                   String major, String phone, BigDecimal gpa, LocalDate dateOfBirth) {
        this.studentCode = studentCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.major = major;
        this.phone = phone;
        this.gpa = gpa;
        this.dateOfBirth = dateOfBirth;
    }

    public Long getId() { return id; }
    public String getStudentCode() { return studentCode; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getMajor() { return major; }
    public String getPhone() { return phone; }
    public BigDecimal getGpa() { return gpa; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }

    public void updateDetails(String studentCode, String firstName, String lastName,
                              String major, String phone, BigDecimal gpa, LocalDate dateOfBirth) {
        this.studentCode = studentCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.major = major;
        this.phone = phone;
        this.gpa = gpa;
        this.dateOfBirth = dateOfBirth;
    }
}
