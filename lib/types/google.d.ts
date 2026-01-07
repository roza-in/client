/**
 * Google Sign-In Type Declarations
 * Google Identity Services library types
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfiguration) => void;
          prompt: (callback?: PromptNotificationCallback) => void;
          renderButton: (
            element: HTMLElement | null,
            options: GoogleButtonConfiguration
          ) => void;
          disableAutoSelect: () => void;
          storeCredential: (credential: StoredCredential) => void;
          cancel: () => void;
          revoke: (hint: string, callback?: RevokeCallback) => void;
        };
        oauth2: {
          initTokenClient: (config: TokenClientConfig) => TokenClient;
          initCodeClient: (config: CodeClientConfig) => CodeClient;
          hasGrantedAllScopes: (tokenResponse: TokenResponse, ...scopes: string[]) => boolean;
          hasGrantedAnyScope: (tokenResponse: TokenResponse, ...scopes: string[]) => boolean;
          revoke: (accessToken: string, callback?: () => void) => void;
        };
      };
    };
  }
}

interface GoogleIdConfiguration {
  client_id: string;
  callback?: (response: CredentialResponse) => void;
  auto_select?: boolean;
  login_uri?: string;
  native_callback?: (response: CredentialResponse) => void;
  cancel_on_tap_outside?: boolean;
  prompt_parent_id?: string;
  nonce?: string;
  context?: 'signin' | 'signup' | 'use';
  state_cookie_domain?: string;
  ux_mode?: 'popup' | 'redirect';
  allowed_parent_origin?: string | string[];
  intermediate_iframe_close_callback?: () => void;
  itp_support?: boolean;
  use_fedcm_for_prompt?: boolean;
}

interface CredentialResponse {
  credential: string;
  select_by?: 'auto' | 'user' | 'user_1tap' | 'user_2tap' | 'btn' | 'btn_confirm' | 'btn_add_session' | 'btn_confirm_add_session';
  clientId?: string;
}

interface GoogleButtonConfiguration {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: number;
  locale?: string;
  click_listener?: () => void;
}

interface PromptNotificationCallback {
  (notification: PromptMomentNotification): void;
}

interface PromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => 'browser_not_supported' | 'invalid_client' | 'missing_client_id' | 'opt_out_or_no_session' | 'secure_http_required' | 'suppressed_by_user' | 'unregistered_origin' | 'unknown_reason';
  isSkippedMoment: () => boolean;
  getSkippedReason: () => 'auto_cancel' | 'user_cancel' | 'tap_outside' | 'issuing_failed';
  isDismissedMoment: () => boolean;
  getDismissedReason: () => 'credential_returned' | 'cancel_called' | 'flow_restarted';
  getMomentType: () => 'display' | 'skipped' | 'dismissed';
}

interface StoredCredential {
  id: string;
  password: string;
}

type RevokeCallback = (response: RevocationResponse) => void;

interface RevocationResponse {
  successful: boolean;
  error?: string;
}

interface TokenClientConfig {
  client_id: string;
  callback: (response: TokenResponse) => void;
  scope: string;
  prompt?: '' | 'none' | 'consent' | 'select_account';
  enable_serial_consent?: boolean;
  hint?: string;
  hosted_domain?: string;
  state?: string;
  error_callback?: (error: TokenClientError) => void;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  hd?: string;
  prompt: string;
  token_type: string;
  scope: string;
  state?: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
}

interface TokenClientError {
  type: 'popup_failed_to_open' | 'popup_closed' | 'unknown';
  message?: string;
}

interface TokenClient {
  requestAccessToken: (overrideConfig?: Partial<TokenClientConfig>) => void;
}

interface CodeClientConfig {
  client_id: string;
  scope: string;
  callback: (response: CodeResponse) => void;
  redirect_uri?: string;
  state?: string;
  enable_serial_consent?: boolean;
  hint?: string;
  hosted_domain?: string;
  ux_mode?: 'popup' | 'redirect';
  select_account?: boolean;
  error_callback?: (error: TokenClientError) => void;
}

interface CodeResponse {
  code: string;
  scope: string;
  state?: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
}

interface CodeClient {
  requestCode: () => void;
}

export {};
