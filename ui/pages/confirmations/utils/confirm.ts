import { ApprovalRequest } from '@metamask/approval-controller';
import { ApprovalType } from '@metamask/controller-utils';
import { TransactionType } from '@metamask/transaction-controller';
import { Json } from '@metamask/utils';

import { sanitizeMessage } from '../../../helpers/utils/util';
import { SignatureRequestType } from '../types/confirm';

export const REDESIGN_APPROVAL_TYPES = [
  ApprovalType.EthSignTypedData,
  ApprovalType.PersonalSign,
] as const;

export const REDESIGN_TRANSACTION_TYPES = [
  ...(process.env.ENABLE_CONFIRMATION_REDESIGN
    ? [TransactionType.contractInteraction]
    : []),
] as const;

const SIGNATURE_APPROVAL_TYPES = [
  ApprovalType.EthSign,
  ApprovalType.PersonalSign,
  ApprovalType.EthSignTypedData,
];

export const isSignatureApprovalRequest = (
  request: ApprovalRequest<Record<string, Json>>,
) => SIGNATURE_APPROVAL_TYPES.includes(request.type as ApprovalType);

const SIGNATURE_TRANSACTION_TYPES = [
  TransactionType.personalSign,
  TransactionType.signTypedData,
];

export const isSignatureTransactionType = (request?: Record<string, unknown>) =>
  request &&
  SIGNATURE_TRANSACTION_TYPES.includes(request.type as TransactionType);

export const parseTypedDataMessage = (dataToParse: string) => {
  const { message, domain = {}, primaryType, types } = JSON.parse(dataToParse);
  const sanitizedMessage = sanitizeMessage(message, primaryType, types);
  return { domain, sanitizedMessage, primaryType };
};

export const isSIWESignatureRequest = (request: SignatureRequestType) =>
  request.msgParams?.siwe?.isSIWEMessage;
