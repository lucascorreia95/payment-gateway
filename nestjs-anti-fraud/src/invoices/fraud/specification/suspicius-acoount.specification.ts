import { FraudReason } from "@prisma/client";
import { FraudDetectionResult, FraudSpecificationContext, IFraudSpecification } from "./fraud-specification.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SuspiciousAccountSpecification implements IFraudSpecification {
  detectFraud(context: FraudSpecificationContext): FraudDetectionResult {
    const { account } = context

    if(account.isSuspicious) {
      return {
        hasFraud: true,
        reason: FraudReason.SUSPICIOUS_ACCOUNT,
        description: 'Account is flagged as suspicious'
      }
    }

    return {
      hasFraud: false
    }
  }
}