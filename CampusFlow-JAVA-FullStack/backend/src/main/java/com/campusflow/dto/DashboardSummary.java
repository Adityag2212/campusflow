package com.campusflow.dto;

import java.math.BigDecimal;

public record DashboardSummary(long totalStudents, long distinctMajors, BigDecimal averageGpa) {
}
