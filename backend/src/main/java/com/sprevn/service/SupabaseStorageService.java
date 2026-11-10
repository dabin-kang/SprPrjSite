
package com.sprevn.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url:}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key:}")
    private String serviceRoleKey;

    @Value("${supabase.storage-bucket:spr_sg}")
    private String bucket;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public String uploadProjectImage(
            MultipartFile file,
            String slug
    ) throws IOException, InterruptedException {

        if (supabaseUrl == null || supabaseUrl.isBlank()) {
            throw new IllegalStateException("SUPABASE_URL 설정이 없습니다.");
        }

        if (serviceRoleKey == null || serviceRoleKey.isBlank()) {
            throw new IllegalStateException(
                    "SUPABASE_SERVICE_ROLE_KEY 설정이 없습니다."
            );
        }

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("이미지 파일을 선택해 주세요.");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("이미지는 5MB 이하만 업로드할 수 있습니다.");
        }

        String contentType = file.getContentType();

        String extension;

        if ("image/jpeg".equals(contentType)) {
            extension = "jpg";
        } else if ("image/png".equals(contentType)) {
            extension = "png";
        } else if ("image/webp".equals(contentType)) {
            extension = "webp";
        } else {
            throw new IllegalArgumentException(
                    "JPG, PNG, WEBP 이미지만 업로드할 수 있습니다."
            );
        }

        if (slug == null || !slug.matches("[a-z0-9]+(?:-[a-z0-9]+)*")) {
            throw new IllegalArgumentException("올바르지 않은 프로젝트 URL 식별자입니다.");
        }

        String filePath = "projects/" + slug + "/"
                + UUID.randomUUID() + "." + extension;

        String encodedPath = java.util.Arrays.stream(filePath.split("/"))
                .map(part -> URLEncoder.encode(part, StandardCharsets.UTF_8)
                        .replace("+", "%20"))
                .collect(java.util.stream.Collectors.joining("/"));

        String baseUrl = supabaseUrl.replaceAll("/+$", "");

        URI uploadUri = URI.create(
                baseUrl + "/storage/v1/object/"
                        + bucket + "/" + encodedPath
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(uploadUri)
                .header("Authorization", "Bearer " + serviceRoleKey)
                .header("apikey", serviceRoleKey)
                .header("Content-Type", contentType)
                .header("x-upsert", "false")
                .POST(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                .build();

        HttpResponse<String> response = httpClient.send(
                request,
                HttpResponse.BodyHandlers.ofString()
        );

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IllegalStateException(
                    "Supabase 이미지 업로드 실패 (HTTP "
                            + response.statusCode() + "): "
                            + response.body()
            );
        }

        return filePath;
    }
}
