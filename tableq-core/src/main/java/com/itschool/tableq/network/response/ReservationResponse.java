package com.itschool.tableq.network.response;

import com.itschool.tableq.domain.Reservation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter

public class ReservationResponse {
    private Long id;
    private Integer reservationNumber;
    private Boolean isEntered;
    private LocalDateTime createdAt;
    private LocalDateTime lastModifiedAt;
    private Integer people;
    private Long restaurantId;
    private Long userId;

    public ReservationResponse(Reservation reservation) {
        this.id = reservation.getId();
        this.reservationNumber = reservation.getReservationNumber();
        this.isEntered = reservation.getIsEntered();
        this.people = reservation.getPeople();
        this.restaurantId = reservation.getRestaurant().getId();
        this.userId = reservation.getUser().getId();
        this.createdAt = reservation.getCreatedAt();
        this.lastModifiedAt = reservation.getLastModifiedAt();
    }
}
