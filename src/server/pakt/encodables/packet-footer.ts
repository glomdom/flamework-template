import { HttpService as HTTP } from "@rbxts/services";

import { Size } from "shared/utility/number-size";
import { Encodable, InvalidEncodableException } from "../encodable";
import { SizedString } from "./sized-string";
import type { BinaryReader } from "shared/classes/binary-reader";

const PAKT_SESSION_ID = HTTP.GenerateGUID(false);
export const SESSION_ID_SIZE = PAKT_SESSION_ID.size() * Size.byte();

export class PacketFooter extends Encodable {
  public static readonly size = SESSION_ID_SIZE;

  public constructor(
    public readonly sessionID = PAKT_SESSION_ID
  ) { super(); }

  public static parse(reader: BinaryReader): PacketFooter {
    const sessionID = SizedString.parse(reader);
    const footer = new PacketFooter(sessionID);
    footer.validate();

    return footer;
  }

  public encode(): Buffer {
    const sessionIDBytes = new SizedString(this.sessionID).encode();

    return [
      ...sessionIDBytes
    ];
  }

  public validate(): void {
    this.validateExpression(this.sessionID === PAKT_SESSION_ID, "sessionID");
  }

  protected validateExpression<T extends boolean>(expression: T, fieldName: string): void {
    if (expression) return;
    throw new InvalidEncodableException("PacketFooter", fieldName);
  }
}