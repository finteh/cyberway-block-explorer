import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { State as BlockchainState } from '../../store/reducers/blockchain';
import Link from '../Link';

const REFRESH_EVERY = 3000;

const Wrapper = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: #f6f6f6;
`;

const Title = styled.div`
  font-size: 18px;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Line = styled.div`
  margin: 6px 0;
`;

const Label = styled.span``;

const Value = styled.span``;

type Props = {
  blockchainInfo: BlockchainState;
  loadBlockChainInfo: Function;
};

export default class BlockChainStatus extends PureComponent<Props> {
  private _updateInterval: number | undefined;

  componentDidMount() {
    this._updateInterval = setInterval(this.load, REFRESH_EVERY);

    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.onVisibilityChange);

    clearInterval(this._updateInterval);
  }

  load = () => {
    const { loadBlockChainInfo } = this.props;
    loadBlockChainInfo();
  };

  onVisibilityChange = () => {
    clearInterval(this._updateInterval);

    if (!document.hidden) {
      this._updateInterval = setInterval(this.load, REFRESH_EVERY);
    }
  };

  render() {
    const { blockchainInfo: info } = this.props;

    return (
      <Wrapper>
        <Title>Blockchain status:</Title>
        <Line>
          <Label>Last block: </Label>
          <Value>
            <Link to={`/block/${info.lastBlockId}`} keepHash>
              #{info.lastBlockNum}
            </Link>
          </Value>
        </Line>
        <Line>
          <Label>Irreversible block: </Label> <Value>#{info.irreversibleBlockNum}</Value>
        </Line>
        <Line>
          <Label>Total transactions:</Label> <Value>{info.totalTransactions}</Value>
        </Line>
      </Wrapper>
    );
  }
}
