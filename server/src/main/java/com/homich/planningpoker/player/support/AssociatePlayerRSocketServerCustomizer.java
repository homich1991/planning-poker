package com.homich.planningpoker.player.support;

import io.rsocket.core.RSocketServer;
import org.springframework.boot.rsocket.server.RSocketServerCustomizer;
import org.springframework.stereotype.Component;

@Component
public class AssociatePlayerRSocketServerCustomizer implements RSocketServerCustomizer {
    @Override
    public void customize(RSocketServer rSocketServer) {
        rSocketServer.interceptors(ir -> ir.forRequester(PlayerAwareRSocket::new));
    }
}
