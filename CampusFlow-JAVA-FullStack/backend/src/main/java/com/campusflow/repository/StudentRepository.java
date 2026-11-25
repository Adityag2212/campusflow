package com.campusflow.repository;

import com.campusflow.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByStudentCodeIgnoreCase(String studentCode);
    boolean existsByStudentCodeIgnoreCase(String studentCode);
    boolean existsByStudentCodeIgnoreCaseAndIdNot(String studentCode, Long id);

    @Query("""
        select s from Student s
        where lower(s.studentCode) like lower(concat('%', :term, '%'))
           or lower(s.firstName) like lower(concat('%', :term, '%'))
           or lower(s.lastName) like lower(concat('%', :term, '%'))
           or lower(s.major) like lower(concat('%', :term, '%'))
           or lower(coalesce(s.phone, '')) like lower(concat('%', :term, '%'))
        """)
    List<Student> search(@Param("term") String term);

    @Query("select count(distinct s.major) from Student s")
    long countDistinctMajors();

    @Query("select avg(s.gpa) from Student s")
    BigDecimal averageGpa();
}
