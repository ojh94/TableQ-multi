package com.itschool.tableq.repository;

import com.itschool.tableq.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);

    Optional<User> getFirstByOrderByIdDesc();

    Optional<Long> countBy();
}
