import { Calendar } from "../Calendar";

// fireEvent는 클릭과 같은 이벤트 동작을 수행
// waitForElementToBeRemoved는 요소가 사라지는지 기다림
import { fireEvent, render, screen, waitForElementToBeRemoved } from "@/test-utils";

test("Reserve appointment", async () => {
    // Calendar 컴포넌트 렌더링하기
    render(<Calendar />);

    // 예약 버튼 찾기 -> 시간을 나타내는 정규표현식의 버튼을 모두 찾기
    const appointments = await screen.findAllByRole("button", {
        name: /\d\d? [ap]m\s+(scrub|facial|massage)/i,
    });

    // 위에서 찾은 모든 버튼 중 첫번째 버튼 클릭하기
    // 어떤 버튼인지는 중요하지 않고 단지 예약 시, 텍스트 콘텐츠의 알림이 나타나는지 확인하는게 중요함
    fireEvent.click(appointments[0]);

    // 토스트 알람을 가져와 해당 토스트 상태 메시지에 "예약"이라는 단어가 있는지 확인하기
    const alertToast = await screen.findByRole("status");
    expect(alertToast).toHaveTextContent("예약");

    // 닫기 버튼 찾고 해당 버튼을 누르기 -> 토스트 알람이 사라질때까지 기다림
    const alertCloseButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(alertCloseButton);
    await waitForElementToBeRemoved(alertToast);
});
