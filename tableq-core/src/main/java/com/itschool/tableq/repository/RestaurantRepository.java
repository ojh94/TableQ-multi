package com.itschool.tableq.repository;

import com.itschool.tableq.domain.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    Optional<Restaurant> getFirstByOrderByIdDesc();

    @Query("SELECT r FROM Restaurant r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Restaurant> searchByName(@Param("keyword") String keyword);

    @Query("SELECT r FROM Restaurant r WHERE LOWER(r.address) LIKE LOWER(CONCAT('%', :address, '%'))")
    List<Restaurant> searchByAddress(@Param("address") String address);

    Optional<Long> countBy();
}