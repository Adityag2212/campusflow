package com.campusflow.service;

import com.campusflow.dto.DashboardSummary;
import com.campusflow.dto.StudentRequest;
import com.campusflow.entity.Student;
import com.campusflow.repository.StudentRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
public class StudentService {
    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    public List<Student> findStudents(String search, String sort) {
        List<Student> students = repository.search(search == null ? "" : search.trim());
        Comparator<Student> comparator = switch (sort == null ? "name" : sort) {
            case "major" -> Comparator.comparing(Student::getMajor, String.CASE_INSENSITIVE_ORDER);
            case "gpa" -> Comparator.comparing(Student::getGpa).reversed();
            case "newest" -> Comparator.comparing(Student::getId).reversed();
            default -> Comparator.comparing(Student::getFirstName, String.CASE_INSENSITIVE_ORDER)
                    .thenComparing(Student::getLastName, String.CASE_INSENSITIVE_ORDER);
        };
        students.sort(comparator);
        return students;
    }

    public Student findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found."));
    }

    public Student create(StudentRequest request) {
        if (repository.existsByStudentCodeIgnoreCase(request.studentCode().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That student ID is already in use.");
        }
        Student student = new Student(
                request.studentCode().trim(), request.firstName().trim(), request.lastName().trim(),
                request.major().trim(), cleanPhone(request.phone()), request.gpa(), request.dateOfBirth()
        );
        return repository.save(student);
    }

    public Student update(Long id, StudentRequest request) {
        Student student = findById(id);
        if (repository.existsByStudentCodeIgnoreCaseAndIdNot(request.studentCode().trim(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That student ID is already in use.");
        }
        student.updateDetails(
                request.studentCode().trim(), request.firstName().trim(), request.lastName().trim(),
                request.major().trim(), cleanPhone(request.phone()), request.gpa(), request.dateOfBirth()
        );
        return repository.save(student);
    }

    public void delete(Long id) {
        Student student = findById(id);
        repository.delete(student);
    }

    public DashboardSummary getSummary() {
        long total = repository.count();
        return new DashboardSummary(total, repository.countDistinctMajors(),
                repository.averageGpa() == null ? java.math.BigDecimal.ZERO : repository.averageGpa());
    }

    private String cleanPhone(String phone) {
        return phone == null || phone.isBlank() ? null : phone.trim();
    }
}
