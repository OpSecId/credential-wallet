import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateSecureRandom } from 'react-native-securerandom';
const DidMethodKey = require('@digitalcredentials/did-method-key');

console.log({ DidMethodKey });

import { DidKey, DidDocument } from '../../types/did';
import { DidRecord, DidRecordRaw } from '../../model';

const didKeyDriver = DidMethodKey.driver();

export type DidState = {
  rawDidRecords: DidRecordRaw[];
};

const initialState: DidState = {
  rawDidRecords: [],
};

const mintDid = createAsyncThunk('didState/mintDid', async (_, { dispatch }) => {
  const { didDocument, keyPairs } = await didKeyDriver.generate({
    randomBytes: await generateSecureRandom(32),
  });

  const [
    verificationKey,
    keyAgreementKey,
  ]: DidKey[] = Array.from(keyPairs.entries()).map(
    (pair) => pair.export({ publicKey: true, privateKey: true }),
  );

  await dispatch(addDidRecord({ didDocument, verificationKey, keyAgreementKey }));
  await dispatch(getAllDidRecords());
});

const getAllDidRecords = createAsyncThunk('didState/getAllDidRecords', async () => ({
  rawDidRecords: await DidRecord.getAllDidRecords(),
}));

const addDidRecord = createAsyncThunk('didState/addDidRecord', async ({
  didDocument,
  verificationKey,
  keyAgreementKey,
}: {
  didDocument: DidDocument,
  verificationKey: DidKey,
  keyAgreementKey: DidKey,
}, { dispatch }) => {
  await DidRecord.addDidRecord(didDocument, verificationKey, keyAgreementKey);
  await dispatch(getAllDidKeys());
});

const deleteDidRecord = createAsyncThunk('didState/deleteDidRecord', async (rawRecord: DidRecordRaw, { dispatch }) => {
  await DidRecord.deleteDidRecord(rawRecord);
  await dispatch(getAllDidRecords());
});

const didSlice = createSlice({
  name: 'didState',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllDidRecords.fulfilled, (state, action) => ({
      ...state,
      ...action.payload,
    }));
  },
});

export default didSlice.reducer;
export {
  mintDid,
  getAllDidRecords,
  addDidRecord,
  deleteDidRecord,
};
