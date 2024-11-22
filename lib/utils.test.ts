import { cn } from '@/lib/utils';

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional class names', () => {
      expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
    });

    it('should handle array of class names', () => {
      expect(cn(['class1', 'class2'])).toBe('class1 class2');
    });

    it('should handle object of class names', () => {
      expect(cn({ class1: true, class2: false, class3: true })).toBe('class1 class3');
    });

    it('should handle mixed inputs', () => {
      expect(cn('class1', ['class2', 'class3'], { class4: true, class5: false })).toBe(
        'class1 class2 class3 class4',
      );
    });
  });
});
