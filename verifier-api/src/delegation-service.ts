import { RESTClient } from "@initia/initia.js";
import { Dec } from "@keplr-wallet/unit";
import { DelegationInfo } from "./types.js";
import { config } from "./config.js";
import { formatLog } from "./utils.js";

export class DelegationService {
  private restClient: RESTClient;

  constructor(rpcEndpoint?: string) {
    this.restClient = new RESTClient(rpcEndpoint || config.rpcEndpoint);
  }

  /**
   * 주소의 delegation 정보 조회
   */
  async getDelegationInfo(address: string): Promise<DelegationInfo> {
    try {
      console.log(
        formatLog("INFO", "Fetching delegation info", {
          address,
          validator: config.validatorAddress,
        })
      );

      const delegation = await this.restClient.mstaking.delegation(
        address,
        config.validatorAddress
      );

      const balance = delegation.balance.get(config.denom);

      if (!balance) {
        throw new Error("Delegation not found for the specified validator");
      }

      const amount = balance.amount;
      console.log(
        formatLog("INFO", "Delegation balance retrieved", {
          amount,
          denom: config.denom,
        })
      );

      const balanceDec = new Dec(amount);
      const requiredDec = new Dec(
        config.requiredAmount * 10 ** config.decimals
      );
      const isEnough = balanceDec.gte(requiredDec);

      return {
        amount,
        denom: config.denom,
        isEnough,
      };
    } catch (error) {
      console.error(
        formatLog("ERROR", "Failed to fetch delegation info", { error })
      );
      throw new Error(
        `Failed to fetch delegation info: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * delegation 정보를 기반으로 자격 검증
   */
  async verifyDelegation(address: string): Promise<{
    isQualified: boolean;
    delegationAmount: string;
    requiredAmount: string;
  }> {
    const delegationInfo = await this.getDelegationInfo(address);

    const requiredAmount = (
      config.requiredAmount *
      10 ** config.decimals
    ).toString();

    return {
      isQualified: delegationInfo.isEnough,
      delegationAmount: delegationInfo.amount,
      requiredAmount,
    };
  }

  /**
   * 사용자 친화적인 delegation 양 포맷팅
   */
  formatDelegationAmount(amount: string): string {
    const dec = new Dec(amount);
    const formatted = dec.quo(new Dec(10 ** config.decimals));
    return `${formatted.toString()} ${config.denom
      .replace("u", "")
      .toUpperCase()}`;
  }
}
