package com.example.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/login", "/api/users/register").permitAll()
                // Shifts
                .requestMatchers(HttpMethod.GET, "/api/shifts").hasAnyRole("ADMIN", "EMPLOYEE")
                .requestMatchers("/api/shifts/**").hasRole("ADMIN")
                // Attendance
                .requestMatchers(HttpMethod.GET, "/api/attendance").hasRole("ADMIN")
                .requestMatchers("/api/attendance/clear").hasRole("ADMIN")
                .requestMatchers("/api/attendance/check-in", "/api/attendance/check-out", "/api/attendance/user/**").hasAnyRole("ADMIN", "EMPLOYEE")
                // Leaves
                .requestMatchers(HttpMethod.GET, "/api/leaves").hasRole("ADMIN")
                .requestMatchers("/api/leaves/update-status/**").hasRole("ADMIN")
                .requestMatchers("/api/leaves/apply", "/api/leaves/user/**").hasAnyRole("ADMIN", "EMPLOYEE")
                // Tickets
                .requestMatchers("/api/tickets/admin", "/api/tickets/hide/**").hasRole("ADMIN")
                .requestMatchers("/api/tickets/raise", "/api/tickets/raised-by/**", "/api/tickets/**").hasAnyRole("ADMIN", "EMPLOYEE")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
