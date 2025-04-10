'use client';

import CreateAdForm from './CreateAdForm';
import PageLayout from '../../components/PageLayout';

export default function CreateAdPage() {
  return (
    <PageLayout
      title="CRÉER UNE ANNONCE"
      subtitle="Publiez votre annonce en quelques clics"
    >
      <CreateAdForm />
    </PageLayout>
  );
} 