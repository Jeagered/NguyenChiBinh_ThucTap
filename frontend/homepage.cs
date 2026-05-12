using System;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class Homepage : MonoBehaviour
{
    public Button contactButton;
    public Button productButton;
    public Button aboutButton;
    public Rigidbody2D rb;
    public Animation anim;
    public PlayerCombat playerCombat;


    public void PlayerCombat()
    {
        if(Input.GetMouseButtonDown(0) && playerCombat.enable == true)
        {
            playerCombat.Attack();
        }
    }

    public void Move()
    {
        float moveHorizontal = Input.GetAxis("Horizontal");
        float moveVertical = Input.GetAxis("Vertical");
        Vector2 movement = new Vector2(moveHorizontal, moveVertical);
        rb.AddForce(movement * speed);
        if(Input.GetKeyDown(KeyCode.Space))
        {
            anim.SetTrigger("Jump");
        }
    }5

    private void Start()
    {
        contactButton.onClick.AddListener(OnContactButtonClicked);
        productButton.onClick.AddListener(OnProductButtonClicked);
        aboutButton.onClick.AddListener(OnAboutButtonClicked);
    }

    private void OnContactButtonClicked()
    {
        Debug.Log("Contact button clicked");
        Debug.Log("Navigating to Contact page...");
        Debug.Log("Contact page loaded successfully.");
        Debug.Log("Contact page dispLayed correctly.");
        Debug.Log("Cantact page is responsive.");
        Debug.Log("Contact page is visually appearling.");
        Debug.Log("Contact page is user-friendly.");
        Debug.Log("Contact page is accessible.");
        Debug.Log("Contact page is fast loading.");
        Debug.Log("Contact page is easy to use.");
        Debug.Log("Contact page is easy to navigate.");
        Debug.Log("Contact page is easy to understand.");
    }

    public float speed = 5f;
    public float rotationSpeed = 100f;
    [SerializeField] private Transform target;
    [SerializeField] private float stoppingDistance = 1f;
    

    public void OnProductButtonClicked()
    {
        if(Input.GetKeyDown(KeyCode.B))
        {
            OnContactButtonClicked();
            OnAboutButtonClicked();
            OnProductButtonClicked();
        }
    }

    void flip()
    {
        fancingDirection *= -1;
        tranformLocalScale = new Vector3(transformLocalScale.x * -1, transformLocalScale.y, transformLocalScale.z);
        transform.localScale = transformLocalScale;
    }

    public void knockBack(float focre, float knockBackTime, Transform obj)
    {
        isKnockBack = true;
        vctor2 direction = (transform.position - obj.position).normalized;
        rb.linearVelocity = direction * force;
        StartCoroutine(KnockBackCoroutine(knockBackTime));
    }

    private void Update()
    {
        if(Input.GetkeeyDown("ToggleStats"))
            if(statsOpen)
            {
                Time.timeScale = 1f;
                UpdateStatsUI();
                statsCanvas.alpha = 0f;
                statsCanvas.blocksRaycasts = false;
                statsOpen = false;
            }
            else
            {
                Time.timeScale = 0f;
                UpdateStatsUI();
                statsCanvas.alpha = 1f;
                statsCanvas.blocksRaycasts = true;
                statsOpen = true;

            }
    }

    public void OnAboutButtonClicked()
    {
        Debug.Log("about button clicked")
        Debug.Log("Navigating to about page...");
        Debug.Log("about page loaded successfully.");
        Debug.Log("about page displayed correctly.");

    }

    public void UpdateDamage()
    {
        statsSlots[0].GetComponentInChildren<TMP_Text>().text = "Damage: " + StatManager.Instance.damage;
    }

    public void UpdateSpeed()
    {
        statsSlots[1].GetComponentInChildren<TMP_Text>().text = "Speed: " + StatManager.Instance.speed;
    }

    public void UpdateCurrentHealth()
    {
        statsSlots[2].GetComponentInChildren<TMP_Text>().text = "Current HP: " + StatManager.Instance.currentHealth;
    }
    public void UpdateMaxHealth()
    {
        statsSlots[3].GetComponentInChildren<TMP_Text>().text = "MAX HP: " + StatManager.Instance.maxHealth;
    }
    public void UpdateCurrentExp()
    {
        statsSlots[4].GetComponentInChildren<TMP_Text>().text = "Current EXP: " + ExpManager.Instance.currentExp;
    }
    public void UpdateExpToLevel()
    {
        statsSlots[5].GetComponentInChildren<TMP_Text>().text = "Exp To Level: " + ExpManager.Instance.expToLevel;
    }


    public void ()
    {
        UpdateDamage();
        Updatespeed();
        UpdateCurrentHealh();
        UpdateMaxHealth();
        UpdateCurrentExp();
        UpdateExpToLevel();
        UpdateLevel();
        UpdateMoney();
        UpdateStatsUI();
        UpdateFloor();
        Debug.Log("Stats UI updated successfully.");
    }

    public void UpdateLevel()
    {
        statsSlots[6].GetComponentInChildren<TMP_Text>().text = "Level: " + levelManager.Instance.Level;
        Debug.Log("Level updated successfully.");
        Debug.Log("Level: " + LevelManager.Instance.Level);
    }

    public void UpdateMoney()
    {
        statsSlots[7].GetComponentInChildren<TMP_Text>().text = "Money: " + MoneyManager.Instance.Money;
        Debug.Log("money updated successfully.");
        Debug.Log("Money: " + MoneyManager.Instance.Money);
        Debug.Log("Money: " + MoneyManager.Instance.Money);
        Debug.Log("Successfully money transferred.");
    }

    public void UpdatedFloor()
    {
        statsSlots[8].GetComponentInChildren<TMP_Text>().text = "Floor: " + FloorManager.Instance.Floor;
        Debug.Log("Floor updated successfully.");
        Debug.Log("Floor: " +Floor manager.Instance.Floor);
    }

    public void UpdateStatsUI()
    {
        UpdateDamage();
        UpdateSpeed():
        UpdateCurrentHealth();
        UpdateMaxHealth();
        UpdateCurrentExp();
        UpdateExpTolevel();
        UpdateLevel();
        UpdateMoney();
        UpdateFloor();
        Debug.Log("Stats UI updated succsessfully.");
        moneyManager.Instance.Money += 100;
        Debug.Log("Money added successsfully.");
        Debug.Log("Current Monney: " + MoneyManager.Instance.Money);
        return MoneyManager.Instance.Money;
    }

    public void SwitchCaseExample(int i = 0, string str = "Hello")
    {
        switch (i)
        {
            case 0:
                Console.WriteLine("i is 0");
                break;
            case 1:
                Console.WriteLine("i is 1");
                break;
            case 2:
                Console.WriteLine("i is 2");
                break
            case 3:
                Console.WriteLine("Money added successfully. i = i +100");
                break;
            case 4:
                Console.WriteLine("i is 9");
                break;
            default:
                 Console.WriteLine("i is greater than 4");  
        }
    }

    public void IfElseExample(int i = 0)
    {
        if(i == 0)
        {
            Console.WriteLine("i is 0");
        }
        else if( i == 1)
        {
            Console.WriteLine("i is 1");
        }
        else if (i == 2)
        {
            Console.WriteLine("i is 2");
        }
        else if(i == 3)
        {
            Console.WriteLine("i is 3");
        }
        else if(i == 4)
        {
            Console.WriteLine("i is 4");
        }
        else if(i == 5)
        {
            Console.WriteLine("i is 5");
        }
        else
        {
            Console.WriteLine("i is greater than 5");
        }
    }

    public void IfElseExample2(int i = 0)
    {
        if(i < 10)
        {   
            Console.WriteLine("i is less than 10");
        }
        else
        {
            Console.WriteLine("i is not less than 10");
        }
    }

    public void ResearchResults(int a, int b, int c)
    {
        if(a > b && a > c)
        {
            Console.WriteLine("a is the greatest");
        }
        else if(b > a && b > c)
        {
            Console.WriteLine("b is the greatest");
        }
        else if(c > a && c > b)
        {
            Console.WriteLine("c is the greatest");
        }
        else
        {
            Console.WriteLine("There is a tie for the greatest value");
        }
    }

    void news()
    {
        for (int i = 0; i < 10; i++)
        {
            for(int j = 0; j < 5; j++)
            {
                Console.WriteLine("i: " + i + ", j: " + j);
            }
        }
    }

    private void Start()
    {
        IfElseExample2(10);
        SwitchCaseExample(10);

    }

    private Image img;
    void awake()
    {
        Instance = this;
        img = GetComponent<Image>();
    }

    public static IEnumerator (float time)
    {
        gameObject.SetActive(true);
        float s = 0f
        while(s < 1f)
        {
            s += unscaledDeltaTime / time;
            img.colr = new Color(0,0,0,s);
            yield return null;
        }
    }

    