package com.sprevn.service;

import com.sprevn.dto.LoginRequest;
import com.sprevn.dto.LoginResponse;
import com.sprevn.dto.SignupRequest;
import com.sprevn.entity.User;
import com.sprevn.mapper.UserMapper;
import com.sprevn.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        User user = userMapper.findById(request.getId())
                .orElseThrow(() -> new BadCredentialsException("아이디 또는 비밀번호가 올바르지 않습니다"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("아이디 또는 비밀번호가 올바르지 않습니다");
        }

        if (user.getStatus() == 0) {
            throw new BadCredentialsException("비활성화된 계정입니다");
        }
        if (user.getStatus() == 2) {
            throw new BadCredentialsException("정지된 계정입니다");
        }

        userMapper.updateLastLogin(user.getUserId());

        String role = "admin".equals(user.getId()) ? "ADMIN" : "USER";
        String token = jwtUtil.generateToken(String.valueOf(user.getUserId()), user.getId(), role);

        return LoginResponse.of(token, user);
    }

    public void signup(SignupRequest request) {
        if (userMapper.existsById(request.getId()) > 0) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다");
        }
        if (userMapper.existsByEmail(request.getEmail()) > 0) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다");
        }

        LocalDate birthday = null;
        if (request.getBirthday() != null && !request.getBirthday().isBlank()) {
            birthday = LocalDate.parse(request.getBirthday(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        }

        User user = User.builder()
                .id(request.getId())
                .pname(request.getPname())
                .email(request.getEmail())
                .gender(request.getGender())
                .phoneNumber(request.getPhoneNumber())
                .birthday(birthday)
                .address(request.getAddress())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userMapper.insert(user);
    }

    public List<User> getAllUsers(int page, int size) {
        int offset = (page - 1) * size;
        return userMapper.findAll(offset, size);
    }

    public int getTotalUserCount() {
        return userMapper.countAll();
    }

    public User getUserById(Long userId) {
        return userMapper.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));
    }

    public void updateUserStatus(Long userId, Integer status) {
        getUserById(userId);
        userMapper.updateStatus(userId, status);
    }

    public void updatePassword(Long userId, String newPassword) {
        userMapper.updatePassword(userId, passwordEncoder.encode(newPassword));
    }

    public void deleteUser(Long userId) {
        getUserById(userId);
        userMapper.delete(userId);
    }

    public boolean checkIdDuplicate(String id) {
        return userMapper.existsById(id) > 0;
    }

    public boolean checkEmailDuplicate(String email) {
        return userMapper.existsByEmail(email) > 0;
    }
}
