import { SUPPORT_EMAIL, DISCORD_URL } from '../../lib/constants';

export function SupportFooter() {
  return (
    <div className="mt-8 border-t border-gray-200 pt-4 pb-2 text-center text-xs text-gray-400">
      <p>
        Need help?{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="underline hover:text-gray-600">{SUPPORT_EMAIL}</a>
        {' · '}
        <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Discord</a>
      </p>
    </div>
  );
}
