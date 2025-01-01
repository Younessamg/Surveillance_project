package ma.ensa.surveillance.services;

import lombok.RequiredArgsConstructor;
import ma.ensa.surveillance.dto.PasswordChangeRequest;
import ma.ensa.surveillance.dto.UserProfileUpdateRequest;
import ma.ensa.surveillance.entities.User;
import ma.ensa.surveillance.exception.UserNotFoundException;
import ma.ensa.surveillance.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getUserById(int id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + id + " not found"));
    }


    @Transactional
    public User updateUserById(int id, UserProfileUpdateRequest request) {
        // Retrieve the user by ID
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + id + " not found"));

        // Update email if provided and not already used
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(request.getEmail());
        }

        // Update fullname if provided
        if (request.getFullname() != null) {
            user.setFullname(request.getFullname());
        }

        // Save updated user
        return userRepository.save(user);
    }


    @Transactional
    public void changePassword(PasswordChangeRequest request) {
        User user = getUserFromContext();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteCurrentUser() {
        User user = getUserFromContext();
        userRepository.delete(user);
    }

    private User getUserFromContext() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}