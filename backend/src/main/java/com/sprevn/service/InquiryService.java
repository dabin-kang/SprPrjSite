package com.sprevn.service;

import com.sprevn.entity.Inquiry;
import com.sprevn.mapper.InquiryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryMapper inquiryMapper;

    private int getOffset(int page, int size) {
        if (page < 1 || size < 1 || size > 100) {
            throw new IllegalArgumentException("페이지는 1 이상, 페이지 크기는 1~100이어야 합니다.");
        }
        return (page - 1) * size;
    }

    public List<Inquiry> getAllInquiries(int page, int size) {
        return inquiryMapper.findAll(getOffset(page, size), size);
    }

    public int getTotalCount() {
        return inquiryMapper.countAll();
    }

    public int getUnansweredCount() {
        return inquiryMapper.countUnanswered();
    }

    public Inquiry getInquiry(Long inquiryId) {
        return inquiryMapper.findByInquiryId(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다"));
    }

    public List<Inquiry> getMyInquiries(Long userId) {
        return inquiryMapper.findByUserId(userId);
    }

    public void createInquiry(Inquiry inquiry) {
        if (inquiry.getName() == null || inquiry.getName().isBlank()
                || inquiry.getEmail() == null || inquiry.getEmail().isBlank()
                || inquiry.getTitle() == null || inquiry.getTitle().isBlank()
                || inquiry.getContent() == null || inquiry.getContent().isBlank()) {
            throw new IllegalArgumentException("이름, 이메일, 제목, 문의 내용을 입력해 주세요.");
        }
        inquiryMapper.insert(inquiry);
    }

    public void answerInquiry(Long inquiryId, String answer) {
        getInquiry(inquiryId);
        if (answer == null || answer.isBlank()) {
            throw new IllegalArgumentException("답변 내용을 입력해 주세요.");
        }
        inquiryMapper.answer(inquiryId, answer.trim());
    }

    public void deleteInquiry(Long inquiryId) {
        getInquiry(inquiryId);
        inquiryMapper.delete(inquiryId);
    }
}
