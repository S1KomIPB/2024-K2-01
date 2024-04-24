import styled from 'styled-components'
import Readiness from 'Assets/images/banner-alatukur.png'

export const Background = styled.div`
  background-image: url(${Readiness});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  padding: 12px;
  border-radius: 12px;
  min-height: 154px;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10);
`

export const Text = styled.p`
  font-size: 16px;
  color: #374151;
  font-weight: 700;
  margin-bottom: 8px;
`