package com.akios.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.security.Key;

@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    @Value("${jwt.secret:very_secure_default_secret_key_for_development_purposes_only_needs_to_be_long_enough}")
    private String secret;

    public JwtAuthenticationFilter() {
        super(Config.class);
    }

    public static class Config {
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getURI().getPath();

            if (path.startsWith("/api/admin/")) {
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    return onError(exchange, "Missing authorization header", HttpStatus.UNAUTHORIZED);
                }

                String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    return onError(exchange, "Invalid authorization header", HttpStatus.UNAUTHORIZED);
                }

                String token = authHeader.substring(7);

                try {
                    Key key = Keys.hmacShaKeyFor(secret.getBytes());
                    Claims claims = Jwts.parserBuilder()
                            .setSigningKey(key)
                            .build()
                            .parseClaimsJws(token)
                            .getBody();
                    
                    String roles = claims.get("role", String.class);
                    if (roles == null || !roles.contains("ROLE_ADMIN")) {
                        return onError(exchange, "Forbidden: Admin access required", HttpStatus.FORBIDDEN);
                    }
                    
                    ServerWebExchange mutatedExchange = exchange.mutate()
                            .request(exchange.getRequest().mutate()
                                    .header("X-Auth-Username", claims.getSubject())
                                    .header("X-Auth-Roles", roles)
                                    .build())
                            .build();
                    return chain.filter(mutatedExchange);

                } catch (Exception e) {
                    return onError(exchange, "JWT validation failed", HttpStatus.UNAUTHORIZED);
                }
            }

            return chain.filter(exchange);
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        return exchange.getResponse().setComplete();
    }
}
