import { describe, it, expect } from 'vitest';
import { isServiceVisible, slugFromServicePath } from '../service-visibility';
import type { ServiceDetail } from '../types';

const svc = (slug: string, visible?: boolean): ServiceDetail =>
  ({ slug, name: slug, visible } as ServiceDetail);

describe('isServiceVisible', () => {
  const details = [svc('interior'), svc('exterior', true), svc('roof', false)];

  it('is visible when the service has no explicit flag', () => {
    expect(isServiceVisible(details, 'interior')).toBe(true);
  });

  it('is visible when explicitly true', () => {
    expect(isServiceVisible(details, 'exterior')).toBe(true);
  });

  it('is hidden only when explicitly false', () => {
    expect(isServiceVisible(details, 'roof')).toBe(false);
  });

  it('defaults to visible for an unknown slug', () => {
    expect(isServiceVisible(details, 'unknown')).toBe(true);
  });
});

describe('slugFromServicePath', () => {
  it('extracts the slug from a service route', () => {
    expect(slugFromServicePath('/services/interior')).toBe('interior');
  });

  it('returns the last segment for the bare services path', () => {
    expect(slugFromServicePath('/services')).toBe('services');
  });
});
