package ssafy.m09.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import ssafy.m09.domain.User;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;

@Component
public class JwtTokenProvider {
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 365; // 1 year
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final Set<String> blacklistedTokens = new HashSet<>();

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("employeeId", user.getEmployeeId());
        claims.put("role", user.getPosition().getAuthority());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmployeeId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmployeeId(String token) {return extractAllClaims(cleanToken(token)).getSubject();}

    public String extractRole(String token) {
        return (String) extractAllClaims(cleanToken(token)).get("role");
    }

    private Claims extractAllClaims(String token) {
        String cleanedToken = cleanToken(token);

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(cleanedToken)
                .getBody();
    }

    public boolean validateToken(String token) {
        try {
            String cleanedToken = cleanToken(token);
            if (isTokenBlacklisted(cleanedToken)) {
                return false;
            }

            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(cleanedToken);

            return !isTokenExpired(cleanedToken);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        Date expiration = extractAllClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    public void blacklistToken(String token) {
        blacklistedTokens.add(token);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }

    private String cleanToken(String token) {
        if (token.startsWith("Bearer ")) {
            return token.substring(7).trim();  // "Bearer " 제거 후 trim
        }
        return token.trim();
    }
}
