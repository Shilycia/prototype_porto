import { mount } from '@vue/test-utils';
import LoginPage from '@/views/LoginPage.vue';
import { describe, expect, test } from 'vitest';

describe('LoginPage.vue', () => {
  test('renders login page branding', () => {
    const wrapper = mount(LoginPage);
    expect(wrapper.text()).toContain('DIYUL ADMIN');
    expect(wrapper.text()).toContain('Portfolio Content Management System');
  });
});
