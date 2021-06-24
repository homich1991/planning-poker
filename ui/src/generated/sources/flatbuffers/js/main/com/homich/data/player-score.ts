// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

export class PlayerScore {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
__init(i:number, bb:flatbuffers.ByteBuffer):PlayerScore {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsPlayerScore(bb:flatbuffers.ByteBuffer, obj?:PlayerScore):PlayerScore {
  return (obj || new PlayerScore()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsPlayerScore(bb:flatbuffers.ByteBuffer, obj?:PlayerScore):PlayerScore {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new PlayerScore()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

id():string|null
id(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
id(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

name():string|null
name(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
name(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

role():string|null
role(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
role(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

score():string|null
score(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
score(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

static startPlayerScore(builder:flatbuffers.Builder) {
  builder.startObject(4);
}

static addId(builder:flatbuffers.Builder, idOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, idOffset, 0);
}

static addName(builder:flatbuffers.Builder, nameOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, nameOffset, 0);
}

static addRole(builder:flatbuffers.Builder, roleOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, roleOffset, 0);
}

static addScore(builder:flatbuffers.Builder, scoreOffset:flatbuffers.Offset) {
  builder.addFieldOffset(3, scoreOffset, 0);
}

static endPlayerScore(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createPlayerScore(builder:flatbuffers.Builder, idOffset:flatbuffers.Offset, nameOffset:flatbuffers.Offset, roleOffset:flatbuffers.Offset, scoreOffset:flatbuffers.Offset):flatbuffers.Offset {
  PlayerScore.startPlayerScore(builder);
  PlayerScore.addId(builder, idOffset);
  PlayerScore.addName(builder, nameOffset);
  PlayerScore.addRole(builder, roleOffset);
  PlayerScore.addScore(builder, scoreOffset);
  return PlayerScore.endPlayerScore(builder);
}
}