Feature: 3D Part Viewer - Machining Side Selection

  Background:
    Given I am logged in and on the part viewer

  @part-viewer @TEST_QA-2399
  Scenario: Back machining side updates the 3D viewer
    When I select the back machining side
    Then the 3D viewer should reflect the back view

  @part-viewer @TEST_QA-2400
  Scenario: Top machining side updates the 3D viewer
    When I select the top machining side
    Then the 3D viewer should reflect the top view

  @part-viewer @TEST_QA-2401
  Scenario: Bottom machining side updates the 3D viewer
    When I select the bottom machining side
    Then the 3D viewer should reflect the bottom view

  @part-viewer @TEST_QA-2402
  Scenario: Left machining side updates the 3D viewer
    When I select the left machining side
    Then the 3D viewer should reflect the left view