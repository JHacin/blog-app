import { getText, StaticTextKey } from './general';

jest.mock('../assets/static_text.json', () => ({
  'matching-key': 'matchingValue',
}));

describe('General utils', () => {
  describe('getText', () => {
    it('should return the value for the key it finds in the static text dictionary', () => {
      const result: string = getText('matching-key' as StaticTextKey);

      expect(result).toEqual('matchingValue');
    });

    it('should return the provided key if a matching one cannot be found in the dictionary', () => {
      const result: string = getText('unknown-key' as StaticTextKey);

      expect(result).toEqual('unknown-key');
    });
  });
});
