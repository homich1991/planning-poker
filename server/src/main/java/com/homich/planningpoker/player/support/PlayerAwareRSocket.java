package com.homich.planningpoker.player.support;

import com.homich.planningpoker.entity.Player;
import io.rsocket.RSocket;
import io.rsocket.util.RSocketProxy;

public class PlayerAwareRSocket extends RSocketProxy {

    public Player player;

    public PlayerAwareRSocket(RSocket source) {
        super(source);
    }
}
