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

    public List<Inquiry> getAllInquiries(int page, int size) {
        int offset = (page - 1) * size;
        return inquiryMapper.findAll(offset, size);
    }

    public int getTotalCount() {
        return inquiryMapper.countAll();
    }

    public Inquiry getInquiry(Long inquiryId) {
        return inquiryMapper.findByInquiryId(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다"));
    }

    public List<Inquiry> getMyInquiries(Long userId) {
        return inquiryMapper.findByUserId(userId);
    }

    public void createInquiry(Inquiry inquiry) {
        inquiryMapper.insert(inquiry);
    }

    public void answerInquiry(Long inquiryId, String answer) {
        getInquiry(inquiryId);
        inquiryMapper.answer(inquiryId, answer);
    }

    public void deleteInquiry(Long inquiryId) {
        getInquiry(inquiryId);
        inquiryMapper.delete(inquiryId);
    }
}
