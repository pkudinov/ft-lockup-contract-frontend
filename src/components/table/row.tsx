import { useContext, useState } from 'react';
import {
  Collapse,
  IconButton,
  TableCell,
  TableRow,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom';
import { convertAmount, convertTimestamp } from '../../utils';
import { INearProps, NearContext } from '../../services/near';
import { TMetadata } from '../../services/tokenApi';
import TerminateLockup from '../TerminateLockup';
import TokenIcon from '../TokenIcon';
import ScheduleTable from '../ScheduleTable';

export default function Row(props: { adminControls: boolean, row: ReturnType<any>, token: TMetadata }) {
  const [open, setOpen] = useState(false);
  const { adminControls, row, token } = props;
  const {
    near,
  }: {
    near: INearProps | null
  } = useContext(NearContext);

  if (!near) return null;

  const vestingSchedule = row?.termination_config?.vesting_schedule?.Schedule;

  const selectedAccountPage = window.location.href.split('/').pop() === row.account_id;

  return (
    <>
      <TableRow className={open ? 'expanded exp-row' : 'exp-row'} sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">
          {row.id}
        </TableCell>
        <TableCell align="left"><Link to={`${selectedAccountPage ? '' : row.account_id}`}>{row.account_id}</Link></TableCell>
        <TableCell align="right">
          {convertTimestamp(row.schedule[0].timestamp)}
        </TableCell>
        <TableCell align="right">
          {convertTimestamp(row.schedule[row.schedule.length - 1].timestamp)}
        </TableCell>
        <TableCell align="center">
          {vestingSchedule ? 'Yes' : 'No'}
        </TableCell>
        <TableCell align="right">
          {convertAmount(row.total_balance, token.decimals)}
          &nbsp;
          {token.symbol}
          &nbsp;
          <TokenIcon url={token.icon || ''} size={32} />
        </TableCell>
        <TableCell align="center">
          <div className="progress-bar">
            <div style={{ width: `${(row.claimed_balance / row.total_balance) * 100}%` }} className="claimed">
              <span>{convertAmount(row.claimed_balance, token.decimals)}</span>
            </div>
            <div style={{ width: `${(row.unclaimed_balance / row.total_balance) * 100}%` }} className="available">
              <span>
                {convertAmount(row.unclaimed_balance, token.decimals)}
              </span>
            </div>
            <div style={{ width: `${((row.total_balance - row.claimed_balance - row.unclaimed_balance) / row.total_balance) * 100}%` }} className="vested">
              <span>
                {((row.total_balance - row.claimed_balance - row.unclaimed_balance)
                  / row.total_balance) > 0.2 && convertAmount(row.total_balance
                  - row.claimed_balance - row.unclaimed_balance, token.decimals)}
              </span>
            </div>
            <div style={{ width: `${(row.total_balance - row.total_balance) * 100}%` }} className="unvested">&nbsp;</div>
          </div>
        </TableCell>
      </TableRow>
      <TableRow sx={{ background: '#F4FAFF' }}>
        <TableCell style={{ padding: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className="lockup-row">
              <div style={{ display: 'flex', gap: 20 }}>
                <ScheduleTable schedule={row.schedule} title="Lockup schedule" token={token} />
                {vestingSchedule && (
                  <ScheduleTable schedule={vestingSchedule} title="Vesting schedule" token={token} />
                )}
                <div className="terminate">
                  <TerminateLockup token={token} adminControls={adminControls} lockupIndex={row.id} config={row.termination_config} />
                </div>
              </div>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
