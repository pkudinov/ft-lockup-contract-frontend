import { useParams } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Row from '../../components/table/row';
import ClaimAllLockups from '../../components/Claim';
import { TMetadata } from '../../services/tokenApi';
import { convertAmount } from '../../utils';

export default function UserLockups({ lockups: allLockups, token, adminControls }: { lockups: any[], token: TMetadata, adminControls: boolean }) {
  const { userId } = useParams();

  const lockups = allLockups.filter((x) => x.account_id === userId);

  const totalUnclaimedBalance = lockups.reduce((acc, obj) => acc + parseFloat(obj.unclaimed_balance), 0);

  console.log('user lockups', userId, lockups);

  return (
    <div className="container">

      {!adminControls && <ClaimAllLockups accountId={userId} token={token} total={convertAmount(totalUnclaimedBalance, token.decimals)} />}

      <TableContainer sx={{ boxShadow: 'unset' }} component={Paper}>
        <Table className="main-table" aria-label="collapsible table">
          <TableHead className="table-head">
            <TableRow>
              <TableCell />
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Account ID</TableCell>
              <TableCell align="right">Start&nbsp;date</TableCell>
              <TableCell align="right">End&nbsp;date</TableCell>
              <TableCell align="right">Terminatable</TableCell>
              <TableCell align="right">Total&nbsp;amount</TableCell>
              <TableCell align="center">Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lockups.map((lockup) => (
              <Row key={lockup.id} row={lockup} token={token} adminControls={adminControls} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
}
