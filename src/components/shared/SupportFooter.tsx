import { SUPPORT_EMAIL, DISCORD_URL } from '../../lib/constants';
import { useTranslation } from 'react-i18next';

export function SupportFooter() {
  const { t } = useTranslation();

  return (
    <div className="mt-8 border-t border-warm-200 pt-4 pb-2 text-center text-sm text-warm-500">
      <p>
        {t('support.needHelp')}{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary-500 hover:text-primary-600">{SUPPORT_EMAIL}</a>
        {' · '}
        <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">Discord</a>
      </p>
    </div>
  );
}
