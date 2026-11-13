
package com.sprevn.service;

import com.sprevn.dto.LoginRequest;
import com.sprevn.dto.LoginResponse;
import com.sprevn.dto.SignupRequest;
import com.sprevn.entity.User;
import com.sprevn.mapper.UserMapper;
import com.sprevn.util.JwtUtil;
import org.springframework.dao.DataIntegrityViolationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 로그인
    public LoginResponse login(LoginRequest request) {

        User user = userMapper.findById(request.getId())
                .orElseThrow(() -> new BadCredentialsException(
                    "아이디 또는 비밀번호가 올바르지 않습니다"
                ));

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException(
                "아이디 또는 비밀번호가 올바르지 않습니다"
            );
        }

        if (user.getStatus() == 0) {
            throw new BadCredentialsException("비활성화된 계정입니다");
        }

        if (user.getStatus() == 2) {
            throw new BadCredentialsException("정지된 계정입니다");
        }

        userMapper.updateLastLogin(user.getUserId());

        String role = "admin".equals(user.getId())
                ? "ADMIN"
                : "USER";

        String token = jwtUtil.generateToken(
                String.valueOf(user.getUserId()),
                user.getId(),
                role
        );

        return LoginResponse.of(token, user);
    }

    // 회원가입
    public void signup(SignupRequest request) {
    // 아이디 앞뒤 공백 제거
    String signupId = request.getId().trim();

    // 관리자 아이디는 일반 회원가입에서 사용할 수 없도록 제한
    if ("admin".equalsIgnoreCase(signupId)) {
        throw new IllegalArgumentException("사용할 수 없는 아이디입니다");
    }

    if (userMapper.existsById(signupId) > 0) {
        throw new IllegalArgumentException("이미 사용 중인 아이디입니다");
    }

    if (userMapper.existsByEmail(request.getEmail()) > 0) {
        throw new IllegalArgumentException("이미 사용 중인 이메일입니다");
    }

    LocalDate birthday = null;
    if (request.getBirthday() != null && !request.getBirthday().isBlank()) {
        birthday = LocalDate.parse(
                request.getBirthday(),
                DateTimeFormatter.ofPattern("yyyy-MM-dd")
        );
    }

    User user = User.builder()
            .id(signupId)
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


    // 전체 사용자 조회
    public List<User> getAllUsers(int page, int size) {
        validatePage(page, size);
        int offset = (page - 1) * size;
        return userMapper.findAll(offset, size);
    }

    private void validatePage(int page, int size) {
        if (page < 1 || size < 1 || size > 100) {
            throw new IllegalArgumentException("페이지는 1 이상, 페이지 크기는 1~100이어야 합니다.");
        }
    }

    // 전체 사용자 수
    public int getTotalUserCount() {
        return userMapper.countAll();
    }

    // 사용자 상세 조회
    public User getUserById(Long userId) {
        return userMapper.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                    "사용자를 찾을 수 없습니다"
                ));
    }

    // 사용자 상태 변경
    public void updateUserStatus(Long userId, Integer status) {
        User user = getUserById(userId);
        if (status == null || (status != 0 && status != 1 && status != 2)) {
            throw new IllegalArgumentException("회원 상태는 0, 1, 2 중 하나여야 합니다.");
        }
        if ("admin".equalsIgnoreCase(user.getId()) && status != 1) {
            throw new IllegalArgumentException("관리자 계정은 비활성화하거나 정지할 수 없습니다.");
        }
        userMapper.updateStatus(userId, status);
    }

    public void updateUser(Long userId, com.sprevn.dto.AdminUserUpdateRequest request) {
        User user = getUserById(userId);
        if (request.getPname() != null) {
            if (request.getPname().isBlank()) {
                throw new IllegalArgumentException("이름을 입력해 주세요.");
            }
            user.setPname(request.getPname().trim());
        }
        if (request.getEmail() != null) {
            if (request.getEmail().isBlank()) {
                throw new IllegalArgumentException("이메일을 입력해 주세요.");
            }
            String email = request.getEmail().trim();
            if (userMapper.existsByEmailForOtherUser(email, userId) > 0) {
                throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
            }
            user.setEmail(email);
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender().isBlank() ? null : request.getGender());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber().isBlank() ? null : request.getPhoneNumber());
        }
        if (request.getBirthday() != null) {
            try {
                user.setBirthday(request.getBirthday().isBlank()
                        ? null
                        : LocalDate.parse(request.getBirthday()));
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("생년월일은 YYYY-MM-DD 형식이어야 합니다.");
            }
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress().isBlank() ? null : request.getAddress().trim());
        }
        userMapper.update(user);
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            userMapper.updatePassword(userId, passwordEncoder.encode(request.getPassword()));
        }
    }

    // 비밀번호 변경
    public void updatePassword(Long userId, String newPassword) {
        userMapper.updatePassword(
                userId,
                passwordEncoder.encode(newPassword)
        );
    }

    // 사용자 삭제
    public void deleteUser(Long userId) {
        User user = getUserById(userId);
        if ("admin".equalsIgnoreCase(user.getId())) {
            throw new IllegalArgumentException("관리자 계정은 삭제할 수 없습니다.");
        }
        try {
            userMapper.delete(userId);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException(
                    "콘텐츠나 문의에 연결된 회원은 삭제할 수 없습니다. 상태를 비활성화해 주세요.");
        }
    }

    // 아이디 중복 확인
    public boolean checkIdDuplicate(String id) {
        return userMapper.existsById(id) > 0;
    }

    // 이메일 중복 확인
    public boolean checkEmailDuplicate(String email) {
        return userMapper.existsByEmail(email) > 0;
    }
}
