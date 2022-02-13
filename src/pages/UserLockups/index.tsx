import { useParams } from 'react-router-dom';

export default function UserLockups({ lockups: allLockups }: { lockups: any[] }) {
  const { userId } = useParams();

  const lockups = allLockups.filter((x) => x.account_id === userId);

  console.log('user lockups', userId, lockups);

  return (
    <div>
      <h1>User Lockups Page</h1>
      This page should render all active lockups for specific user.

      <h2>
        User:
        {' '}
        {userId}
      </h2>

      Lockups:
      <ul>
        {lockups.map((lockup) => (
          <li key={lockup.id}>
            id:
            {lockup.id}
            , total amount:
            {lockup.total_balance}
            , claimed amount:
            {lockup.claimed_balance}
            , available amount:
            {lockup.unclaimed_balance}
          </li>
        ))}
      </ul>
    </div>
  );
}
