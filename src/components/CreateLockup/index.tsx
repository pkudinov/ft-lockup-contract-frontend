import { useContext, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { INearProps, NearContext } from '../../services/near';
import { addYear } from '../../utils';
import { TMetadata } from '../../services/tokenApi';
import { TCheckpoint } from '../../services/api';

export default function CreateLockup({ token } : { token: TMetadata }) {
  const {
    near,
  }: {
    near: INearProps | null,
  } = useContext(NearContext);

  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [schedule, setSchedule] = useState<string>('4_year');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onScheduleSelect = (value: any) => {
    setSchedule(value);
  };

  const handleCreateLockup = async (e: any) => {
    if (!near) {
      throw Error('Cannot access token api');
    }

    e.preventDefault();

    const { account, amount } = e.target.elements;

    console.log(account.value, amount.value);

    const lockupContractId = near?.api.getContract().contractId || '';
    const claimedBalance = '0';
    const userAccountId = account.value;
    const lockupTotalAmount = amount.value * 10 ** token.decimals;

    const timestamp = (startDate?.getTime() || 0) / 1000;

    const getScheduleList = (ts: number, date: Date | null, balance: number, selected: string) => {
      const list: { [key: string]: TCheckpoint[] } = {
        '4_year': [
          { timestamp: ts, balance: '0' },
          { timestamp: addYear(date, 1) - 1, balance: '0' },
          { timestamp: addYear(date, 1), balance: (balance / 4).toString() },
          { timestamp: addYear(date, 4), balance: balance.toString() },
        ],
      };
      return list[selected];
    };

    near.tokenApi.ftTransferCall({
      receiver_id: lockupContractId,
      amount: lockupTotalAmount.toString(),
      msg: {
        account_id: userAccountId,
        schedule: getScheduleList(timestamp, startDate, lockupTotalAmount, schedule),
        claimed_balance: claimedBalance,
      },
    });
  };

  return (
    <div>
      <button className="button" type="button" onClick={handleOpen}>Create Lockup</button>
      <Dialog open={open} sx={{ padding: 2 }} maxWidth="xs" onClose={handleClose}>
        <form className="form-submit" onSubmit={handleCreateLockup}>
          <DialogTitle>
            Create Lockup
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ maxWidth: '320px' }}>
            <TextField
              margin="normal"
              id="account"
              label="Account Id"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="normal"
              id="amount"
              label="Amount"
              type="number"
              variant="standard"
              InputProps={{
                endAdornment: <InputAdornment position="end">{token.symbol}</InputAdornment>,
              }}
              fullWidth
            />
            <br />
            <FormControl
              fullWidth
              sx={{ marginTop: '20px' }}
            >
              <Select
                id="schedule-select"
                value={schedule}
                label="Schedule"
                onChange={onScheduleSelect}
                variant="standard"
                fullWidth
              >
                <MenuItem value="4_year">4 year lockup with 25% cliff in 1 year</MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start date"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
                renderInput={
                  (params) => (
                    <TextField
                      margin="normal"
                      fullWidth
                      variant="standard"
                      {...params}
                    />
                  )
                }
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions sx={{ padding: '14px 24px 24px' }}>
            <button className="button fullWidth noMargin" type="submit">Create</button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}